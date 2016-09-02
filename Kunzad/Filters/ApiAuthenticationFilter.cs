using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading;
using System.Web.Http.Controllers;
using Kunzad.Models;
using Kunzad.Services;

namespace Kunzad.Filters
{
    public class ApiAuthenticationFilter : GenericAuthenticationFilter
    {
        private KunzadDbEntities _kunzadEntity;
        private UserServices _userService;
        /// <summary>
        /// Default Authentication Constructor
        /// </summary>
        public ApiAuthenticationFilter()
        {
        }

        /// <summary>
        /// AuthenticationFilter constructor with isActive parameter
        /// </summary>
        /// <param name="isActive"></param>
        public ApiAuthenticationFilter(bool isActive)
            : base(isActive)
        {
        }

        /// <summary>
        /// Protected overriden method for authorizing user
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="actionContext"></param>
        /// <returns></returns>
        protected override bool OnAuthorizeUser(string loginName, string password, HttpActionContext actionContext)
        {
            _kunzadEntity = new KunzadDbEntities();
            _userService = new UserServices(_kunzadEntity);

                var _loginName = _userService.Authenticate(loginName, password);
                if (_loginName != null)
                {
                    var basicAuthenticationIdentity = Thread.CurrentPrincipal.Identity as BasicAuthenticationIdentity;
                    if (basicAuthenticationIdentity != null)
                        basicAuthenticationIdentity.LoginName = _loginName;
                    return true;
                }
            return false;
        }
    }
}