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
        public int intParam1 { get; set;}
        public int intParam2 { get; set; }
        public string stringParam1 { get; set; }
        public string stringParam2 { get; set; }
        public object objParam1 { get; set; }
        public object objParam2 { get; set; }
        public object objParam3 { get; set; }
        public object objParam4 { get; set; }
    }
}