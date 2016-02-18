using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using Kunzad.Models;
using System.Data.Entity;

namespace Kunzad.Services
{
    public class TokenServices : ITokenServices
    {
        #region Private member variables.
        private readonly KunzadDbEntities _kunzadEntity;
        private TokenGenerator tokenGenerator = new TokenGenerator();
        #endregion

        #region Public constructor.
        /// <summary>
        /// Public constructor.
        /// </summary>
        public TokenServices(KunzadDbEntities kunzadEntity)
        {
            _kunzadEntity = kunzadEntity;
        }
        #endregion


        #region Public member methods.

        /// <summary>
        ///  Function to generate unique token with expiry against the provided userId.
        ///  Also add a record in database for generated token.
        /// </summary>

        public Token GenerateToken(string loginName)
        {

            //byte[] byteToken = Encoding.UTF8.GetBytes(loginName + ":" + Guid.NewGuid().ToString() + String.Concat("tsaf"));

            //string token = Convert.ToBase64String(byteToken).ToString(); //basis on checking generated token if it is fastcargo

            string token = tokenGenerator.Encrypt(loginName);

            DateTime issuedOn = DateTime.Now;
            DateTime expiredOn = DateTime.Now.AddSeconds(Convert.ToDouble(ConfigurationManager.AppSettings["AuthTokenExpiry"]));
            var tokendomain = new Token
            {
                LoginName = loginName,
                AuthToken = token,
                IssuedOn = issuedOn,
                ExpiresOn = expiredOn
            };

            _kunzadEntity.Tokens.Add(tokendomain);
            _kunzadEntity.SaveChanges();
            var tokenModel = new Token()
            {
                LoginName = loginName,
                IssuedOn = issuedOn,
                ExpiresOn = expiredOn,
                AuthToken = token
            };

            return tokenModel;
        }

        /// <summary>
        /// Method to validate token against expiry and existence in database.
        /// </summary>
        /// <param name="tokenId"></param>
        /// <returns></returns>
        public bool ValidateToken(string authToken)
        {
            try
            {
                var token = _kunzadEntity.Tokens.Where(t => t.AuthToken == authToken && t.ExpiresOn > DateTime.Now).FirstOrDefault();
                var tokenEntity = token;
                if (token != null && !(DateTime.Now > token.ExpiresOn))
                {
                    //Increase token expiration
                    token.ExpiresOn = token.ExpiresOn.AddSeconds(Convert.ToDouble(ConfigurationManager.AppSettings["AuthTokenExpiry"]));
                    _kunzadEntity.Entry(tokenEntity).CurrentValues.SetValues(token);
                    _kunzadEntity.Entry(tokenEntity).State = EntityState.Modified;
                    _kunzadEntity.SaveChanges();
                    return true;
                }
                else
                    return false;
                //var FromBase64 = Encoding.UTF8.GetString(Convert.FromBase64String(authToken));

                //var credentials = FromBase64.Split(':');
                //if (credentials.Length == 2)
                //{
                //    var x = credentials[1].Substring(credentials[1].Length - 4);
                //    if (credentials[1].Substring(credentials[1].Length - 4).Equals("tsaf")) //if token came from fast
                //    {
                //        var token = _kunzadEntity.Tokens.Where(t => t.AuthToken == authToken && t.ExpiresOn > DateTime.Now).FirstOrDefault();
                //        var tokenEntity = token;
                //        if (token != null && !(DateTime.Now > token.ExpiresOn))
                //        {
                //            //Increase token expiration
                //            token.ExpiresOn = token.ExpiresOn.AddSeconds(Convert.ToDouble(ConfigurationManager.AppSettings["AuthTokenExpiry"]));
                //            _kunzadEntity.Entry(tokenEntity).CurrentValues.SetValues(token);
                //            _kunzadEntity.Entry(tokenEntity).State = EntityState.Modified;
                //            _kunzadEntity.SaveChanges();
                //            return true;
                //        }
                //        else
                //            return false;
                //    }
                //    return false;
                //}
                //return false;
            }
            catch {
                return false;
            }
        }

        /// <summary>
        /// Method to kill the provided token id.
        /// </summary>
        /// <param name="tokenId">true for successful delete</param>
        public bool Kill(string authToken)
        {
            try{
                var tokenEntity = _kunzadEntity.Tokens.Where(t => t.AuthToken == authToken);
                _kunzadEntity.Tokens.Remove(tokenEntity.FirstOrDefault());
                _kunzadEntity.SaveChanges();
                return true;
            }catch{
                return false;
            }
        }

        /// <summary>
        /// Delete tokens for the specific deleted user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>true for successful delete</returns>
        public bool DeleteByUserId(string loginName)
        {
            try
            {
                var tokenEntity = _kunzadEntity.Tokens.Where(t => t.LoginName == loginName);
                _kunzadEntity.Tokens.Remove(tokenEntity.FirstOrDefault());
                _kunzadEntity.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        #endregion
    }
}