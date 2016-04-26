using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Kunzad.Models;
using Kunzad.ActionFilters;

namespace Kunzad.ApiControllers
{
    //[AuthorizationRequired]
    public class UsersController : ApiController
    {
        private KunzadDbEntities db = new KunzadDbEntities();
        private Response response = new Response();
        private TokenGenerator tokenGenerator = new TokenGenerator();
        private DbContextTransaction dbTransaction;
        // GET: api/Users
        public IQueryable<User> GetUsers()
        {
            return db.Users;
        }

        // GET: api/Users/5
        [ResponseType(typeof(User))]
        public IHttpActionResult GetUser(string loginname, string password)
        {
            try
            { 
                response.status = "FAILURE";
                var user = db.Users.Where(u => u.LoginName.Equals(loginname.ToUpper()) && u.Password.Equals(password.ToUpper())).ToArray();
                if (user.Length == 0)
                {
                    response.message = "User not found.";

                }
                else
                {
                    int id = user[0].Id;
                    //Return objects are format this way for better performance
                    response.status = "SUCCESS";
                    response.stringParam1 = tokenGenerator.Encrypt(user[0].LoginName) + ":" + tokenGenerator.Encrypt(user[0].Password);
                    response.objParam1 = (from um in db.UserMenus
                                          where um.UserId == id
                                          where (from m in db.Menus where m.Id == um.MenuId && m.Status == 1 select m).Count() > 0
                                          select new
                                          {
                                              um.MenuId,
                                              MenuAccess = (from ma in db.MenuAccesses where ma.Id == um.MenuAccessId select new { ma.Access}).FirstOrDefault().Access
                                          }).ToArray();
                    response.objParam2 = db.Menus.Where(menu => menu.Status == 1).AsNoTracking().OrderBy(m => m.Sequence).ToArray();
                    response.objParam3 = db.Users.Where(user1 => user1.Id == id).ToArray();
                    response.objParam4 = db.MenuAccesses.AsNoTracking().OrderBy(m => m.MenuId).ToArray();
                }
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }
            return Ok(response);
        }

        [HttpGet]
        //Dynamic filtering
        //[CacheOutput(ClientTimeSpan = AppSettingsGet.ClientTimeSpan, ServerTimeSpan = AppSettingsGet.ServerTimeSpan)]
        public IHttpActionResult GetUser(string type, int param1, [FromUri]List<User> User)
        {
            Object[] users = new Object[AppSettingsGet.PageSize];
            this.filterRecord(param1, type, User.ElementAt(0), User.ElementAt(1), ref users);

            if (users != null)
                return Ok(users);
            else
                return Ok();
        }

        // PUT: api/Users/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUser(int id, User user)
        {
            response.status = "FAILURE";
            if (!ModelState.IsValid)
            {
                response.message = "Bad Request.";
                return Ok(response);
            }

            if (id != user.Id)
            {
                response.message = "User not found";
                return Ok(response);
            }

            try
            {
                dbTransaction = db.Database.BeginTransaction();
                var currentUserMenu = db.UserMenus.Where(um => um.UserId == id);

                if (user.Status == 0)
                    db.UserMenus.RemoveRange(currentUserMenu);
                else
                {
                    bool flag;

                    foreach (UserMenu cum in currentUserMenu)
                    {
                        flag = false;
                        //check if current truck exist in truck list
                        foreach (UserMenu um in user.UserMenus)
                        {
                            if (cum.Id == um.Id)
                            {
                                flag = true;
                                break;
                            }
                        }
                        if (!flag)
                        {
                            //remove deleted truck(s)
                            db.UserMenus.Remove(cum);
                        }
                    }

                    foreach (UserMenu um in user.UserMenus)
                    {
                        flag = false;
                        foreach (UserMenu cum in currentUserMenu)
                        {
                            if (um.Id == cum.Id)
                            {
                                flag = true;
                                break;
                            }
                        }
                        //add truck
                        if (!flag)
                        {
                            db.UserMenus.Add(um);
                        }
                    }
                }
                //Update User Information
                var userRecord = db.Users.Find(id);
                db.Entry(userRecord).CurrentValues.SetValues(user);
                db.Entry(userRecord).State = EntityState.Modified;
                db.SaveChanges();
                response.status = "SUCCESS";
            }
            catch (Exception e)
            {
                response.message = e.InnerException.InnerException.Message.ToString();
            }

            if (response.status != "FAILURE")
            {
                dbTransaction.Commit();
                response.objParam1 = user;
                response.objParam2 = db.UserMenus.Where(um => um.UserId == user.Id).ToArray();
            }
            else
                dbTransaction.Rollback();
            dbTransaction.Dispose();

            return Ok(response);
        }

        // POST: api/Users
        [ResponseType(typeof(User))]
        public IHttpActionResult PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                response.status = "FAILURE";
                response.message = "Bad request.";
                return Ok(response);
            }
            try {
                dbTransaction = db.Database.BeginTransaction();
                int validateLoginName = db.Users.Where(u => u.LoginName.Equals(user.LoginName)).Count();
                if (validateLoginName == 0)
                {
                    response.status = "SUCCESS";
                    user.CreatedDate = DateTime.Now;
                    db.Users.Add(user);
                    user.Password = user.LoginName;
                    db.SaveChanges();
                    foreach (UserMenu userMenu in user.UserMenus)
                    {
                        userMenu.UserId = user.Id;
                        var userMenu1 = db.UserMenus.Where(um => um.UserId == user.Id && um.MenuAccessId == userMenu.MenuAccessId).Count();
                        if (userMenu1 == 0)
                            db.UserMenus.Add(userMenu);
                    }
                    db.SaveChanges();
                }
                else
                {
                    response.status = "FAILURE";
                    response.message = "Login Name is already used.";
                }
            }
            catch (Exception e)
            {
                response.status = "FAILURE";
                response.message = e.Message.ToString();
            }
            if (response.status != "FAILURE")
            {
                dbTransaction.Commit();
                response.objParam1 = user;
                response.objParam2 = db.UserMenus.Where(um => um.UserId == user.Id).ToArray();
            }
            else
                dbTransaction.Rollback();
            dbTransaction.Dispose();
            return Ok(response);

        }

        // DELETE: api/Users/5
        [ResponseType(typeof(User))]
        public IHttpActionResult DeleteUser(int id)
        {
            Response response = new Response();
            response.status = "FAILURE";
            User user = db.Users.Find(id);
            if (user == null)
            {
                response.message = "User not found.";
            }
            else
            {
                var deleteTokens = db.Tokens.Where(t => t.LoginName.Equals(user.LoginName));
                db.Tokens.RemoveRange(deleteTokens);
                db.SaveChanges();
                response.status = "SUCCESS";
            }

            return Ok(response);
        }

        public void filterRecord(int param1, string type, User user, User user1, ref Object[] users)
        {
            /*If date is not nullable in table equate to "1/1/0001 12:00:00 AM" else null
            if integer value is not nullable in table equate to 0 else null*/
            DateTime defaultDate = new DateTime(0001, 01, 01, 00, 00, 00);
            int skip;

            if (type.Equals("paginate"))
            {
                if (param1 > 1)
                    skip = (param1 - 1) * AppSettingsGet.PageSize;
                else
                    skip = 0;
            }
            else
                skip = param1;

            var filteredUsers = (from u in db.Users
                                 select new
                                 {
                                     u.Id,
                                     u.UserTypeId,
                                     u.LoginName,
                                     u.Password,
                                     u.FirstName,
                                     u.MiddleName,
                                     u.LastName,
                                     u.Email,
                                     u.BusinessUnitId,
                                     u.ImageName,
                                     u.Status,
                                     u.CreatedByUserId,
                                     u.CreatedDate,
                                     u.LastUpdatedByUserId,
                                     u.LastUpdatedDate,
                                     UserType = (from ut in db.UserTypes where ut.Id == u.UserTypeId select new { ut.Id, ut.Name }),
                                     BusinessUnit = (from bu1 in db.BusinessUnits where bu1.Id == u.BusinessUnitId select new { bu1.Id, bu1.Code, bu1.Name }),
                                 })
                                            .Where(u => user.Id == null || user.Id == 0 ? true : u.Id == user.Id)
                                            .Where(u => user.LoginName == null ? !user.LoginName.Equals("") : (u.LoginName.ToLower().Equals(user.LoginName.ToLower())))
                                            .Where(u => user.FirstName == null ? !user.FirstName.Equals("") : (u.FirstName.ToLower().Equals(user.FirstName.ToLower())))
                                            .Where(u => user.MiddleName == null ? !user.MiddleName.Equals("") : (u.MiddleName.ToLower().Equals(user.MiddleName.ToLower())))
                                            .Where(u => user.LastName == null ? !user.LastName.Equals("") : (u.LastName.ToLower().Equals(user.LastName.ToLower())))
                                            .OrderBy(u => u.Id)
                                            .Skip(skip).Take(AppSettingsGet.PageSize).ToArray();
            
            users = filteredUsers;
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.Id == id) > 0;
        }
    }
}