using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
namespace Kunzad.Models
{
    static class AppSettingsGet
    {
       
        //get the data to web config

        public const int ClientTimeSpan = 600;
        public  const int ServerTimeSpan = 700;
        //get the data of page size
        internal static  int PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"].ToString()); 
       
    }
}