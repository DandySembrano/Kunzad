using Kunzad.Filters;
using Kunzad.Models;
using Kunzad.Services;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Kunzad.APIControllers
{
    [ApiAuthenticationFilter]
    public class AuthenticateController : ApiController
    {
        #region Private variable.
        private KunzadDbEntities _kunzadEntity;
        private readonly ITokenServices _tokenServices;

        #endregion

        #region Public Constructor

        /// <summary>
        /// Public constructor to initialize product service instance
        /// </summary>
        /// 

        public AuthenticateController() { 
        }
        public AuthenticateController(ITokenServices tokenServices)
        {
            _tokenServices = tokenServices;
        }

        #endregion

        /// <summary>
        /// Authenticates user and returns token with expiry.
        /// </summary>
        /// <returns></returns>
        /// 
        [HttpGet]
        public HttpResponseMessage Authenticate()
        {
            if (System.Threading.Thread.CurrentPrincipal != null && System.Threading.Thread.CurrentPrincipal.Identity.IsAuthenticated)
            {
                var basicAuthenticationIdentity = System.Threading.Thread.CurrentPrincipal.Identity as BasicAuthenticationIdentity;
                if (basicAuthenticationIdentity != null)
                {
                    var loginName = basicAuthenticationIdentity.LoginName;
                    return GetAuthToken(loginName);
                }
            }
            return null;
        }

         //<summary>
         //Returns auth token for the validated user.
         //</summary>
         //<param name="userId"></param>
         //<returns></returns>
        private HttpResponseMessage GetAuthToken(string loginName)
        {
            _kunzadEntity = new KunzadDbEntities();
            var token = new TokenServices(_kunzadEntity);
            Token tokEntity = token.GenerateToken(loginName);
            var response = Request.CreateResponse(HttpStatusCode.OK, "Authorized");

            response.Headers.Add("Token", tokEntity.AuthToken);
            response.Headers.Add("TokenExpiry", ConfigurationManager.AppSettings["AuthTokenExpiry"]);
            response.Headers.Add("Access-Control-Expose-Headers", "Token,TokenExpiry");
            return response;
        }
    }
}
