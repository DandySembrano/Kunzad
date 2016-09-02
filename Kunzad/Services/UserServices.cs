using Kunzad.BusinessServices;
using Kunzad.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Kunzad.Services
{
    public class UserServices : IUserServices
    {
        private readonly KunzadDbEntities _kunzadEntity;

        public UserServices(KunzadDbEntities kunzadEntity)
        {
            this._kunzadEntity = kunzadEntity;
        }


        public string Authenticate(string loginName, string password)
        {
            var user = _kunzadEntity.Users.Where(u => u.LoginName.Equals(loginName) && u.Password.Equals(password)).FirstOrDefault();
            if (user != null)
            {
                return user.LoginName.ToString();
            }
            return null;
        }


    }
}