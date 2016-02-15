using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kunzad.Models
{
    public class ScanningDetails
    {
        public string text { get; set; }
        public string groupName { get; set; }
        public string receiverGroupName { get; set; }
        public string senderGroupName { get; set; }
        public string connectionId { get; set; }
        public int type { get; set; }
    }
}
