using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kunzad.BusinessServices
{
    public interface IUserServices
    {
        string Authenticate(string userName, string password);
    }
}
