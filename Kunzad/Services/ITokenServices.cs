using Kunzad.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kunzad.Services
{
    public interface ITokenServices
    {
        #region Interface member methods.

        Token GenerateToken(string userId);
   
        bool ValidateToken(string tokenId);
    
        bool Kill(string tokenId);
    
        bool DeleteByUserId(string userId);
        #endregion
    }
}
