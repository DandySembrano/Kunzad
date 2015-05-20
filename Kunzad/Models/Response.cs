using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Kunzad.Models
{
    public class Response
    {
        public string status { get; set; }
        public string message { get; set; }
        public object objParam1 { get; set; }
    }
}