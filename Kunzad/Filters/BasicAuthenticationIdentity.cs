using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Principal;

namespace Kunzad.Filters
{
    public class BasicAuthenticationIdentity : GenericIdentity
    {
        /// <summary>
        /// Get/Set for password
        /// </summary>
        public string Password { get; set; }
        /// <summary>
        /// Get/Set for UserName
        /// </summary>
        public string LoginName { get; set; }
        /// <summary>
        /// Get/Set for UserId
        /// </summary>
        public string UserId { get; set; }

        /// <summary>
        /// Basic Authentication Identity Constructor
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        public BasicAuthenticationIdentity(string loginName, string password)
            : base(loginName, "Basic")
        {
            this.Password = password;
            this.LoginName = loginName;
        }
    }
}