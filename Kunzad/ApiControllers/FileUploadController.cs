using Kunzad.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Kunzad.ApiControllers
{
    public class FileUploadController : ApiController
    {
        public KunzadDbEntities db = new KunzadDbEntities();
        [HttpPost]
        public IHttpActionResult Post(int userId)
        {
            Response response = new Response();
            response.status = "FAILURE";
            if (Request.Content.IsMimeMultipartContent())
            {
                string uploadPath = HttpContext.Current.Server.MapPath("~/EmployeeImages");

                var userHolder = db.Users.Find(userId);
                var userHolderEdited = userHolder;
                var filePath = uploadPath + "\\" + (userHolder.ImageName != null ? userHolder.ImageName : "");

                //Delete File if Exist
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }

                MyStreamProvider streamProvider = new MyStreamProvider(uploadPath);

                //Save File sychronously
                Request.Content.ReadAsMultipartAsync(streamProvider);

                //Loop file details
                foreach (var file in streamProvider.FileData)
                {
                    FileInfo fi = new FileInfo(file.LocalFileName);
                    userHolderEdited.ImageName = fi.Name;
                    userHolder.LastUpdatedDate = DateTime.Now;
                    db.Entry(userHolder).CurrentValues.SetValues(userHolderEdited);
                    db.Entry(userHolder).State = EntityState.Modified;
                    db.SaveChanges();
                    //messages.Add("File uploaded as " + fi.FullName + " (" + fi.Length + " bytes)");
                }

                response.status = "SUCCESS";
                response.message = "Successfully Uploaded.";
            }
            else
            {
                response.message = "Invalid Request!";
            }

            return Ok(response);
        }
        [HttpGet]
        public HttpResponseMessage Get(string id)
        {
            HttpResponseMessage result = null;
            var localFilePath = HttpContext.Current.Server.MapPath("~/EmployeeImages/" + id);

            // check if parameter is valid
            if (String.IsNullOrEmpty(id))
            {
                result = Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            // check if file exists on the server
            else if (!File.Exists(localFilePath))
            {
                result = Request.CreateResponse(HttpStatusCode.Gone);
            }
            else
            {// serve the file to the client
                result = Request.CreateResponse(HttpStatusCode.OK);
                result.Content = new StreamContent(new FileStream(localFilePath, FileMode.Open, FileAccess.Read));
                result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                result.Content.Headers.ContentDisposition.FileName = id;
            }

            return result;
        }

        //public async Task<List<string>> PostAsync(int userId)
        //{
        //    if (Request.Content.IsMimeMultipartContent())
        //    {
        //        string uploadPath = HttpContext.Current.Server.MapPath("~/EmployeeImages");

        //        var userHolder = db.Users.Find(userId);
        //        var userHolderEdited = userHolder;
        //        var filePath = uploadPath + "\\" + (userHolder.ImageName != null ? userHolder.ImageName: "");

        //        //Delete File if Exist
        //        if (File.Exists(filePath))
        //        {
        //            File.Delete(filePath);
        //        }

        //        MyStreamProvider streamProvider = new MyStreamProvider(uploadPath);

        //        //Save File asychronously
        //        await Request.Content.ReadAsMultipartAsync(streamProvider);

        //        List<string> messages = new List<string>();
        //        //Loop file details
        //        foreach (var file in streamProvider.FileData)
        //        {
        //            FileInfo fi = new FileInfo(file.LocalFileName);
        //            userHolderEdited.ImageName = fi.Name;
        //            userHolder.LastUpdatedDate = DateTime.Now;
        //            db.Entry(userHolder).CurrentValues.SetValues(userHolderEdited);
        //            db.Entry(userHolder).State = EntityState.Modified;
        //            db.SaveChanges();
        //            messages.Add("File uploaded as " + fi.FullName + " (" + fi.Length + " bytes)");
        //        }

        //        return messages;
        //    }
        //    else
        //    {
        //        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid Request!");
        //        throw new HttpResponseException(response);
        //    }
        //}
    }
}
