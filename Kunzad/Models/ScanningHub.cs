using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using Kunzad.Models;
using Kunzad.ApiControllers;
using System.Web.Script.Serialization;

namespace Kunzad.Models
{
    public class ScanningHub : Hub
    {
        /* 
            * Used group so that scanning will be broadcasted to all instance of a user, ex. a user logged in different browsers or mobile 
              Therefore, each client(user) should have at least one group which is his/her User Id
            * Used dictionary to determine which group that a calling client(user) belongs
        */

        static ConcurrentDictionary<string, string[]> scanningHubDic = new ConcurrentDictionary<string, string[]>();
        private KunzadDbEntities db = new KunzadDbEntities();
        public void addClient(string connectionId, string group)
        {
            /*  
                * Function that add a user with 1 group only
                * connectionId  - connection Id of the client(user) 
                * group         - User Id of the calling client(user)
            */

            string[] userGroup = new string[1];
            userGroup[0] = group;

            //Add client(user) to a group
            Groups.Add(connectionId, group);

            //Add client(user) to dictionary, connectionId as key and userGroup(group) as value in the dictionary
            scanningHubDic.TryAdd(connectionId, userGroup);
        }

        public void scanShipment(ScanningDetails details)
        {
            /*  
                * Function that will scan shipment
                * details  - details needed for scanning
            */
            
            switch (details.type)
            {
                case 1:
                    Clients.Group(details.senderGroupName).broadcastShipmentDetailsToSender(details);
                    break;
                case 2:
                    Clients.Group(details.receiverGroupName).broadcastShipmentDetailsToReciever(details);
                    break;
                case 3:
                    Clients.Group(details.senderGroupName).broadcastShipmentDetailsToSender(details);
                    Clients.Group(details.receiverGroupName).broadcastShipmentDetailsToReciever(details);
                    break;
                default:
                    //Security could be passing generated code or passing the UUID of the device(mobile) then check if it's allowed
                    Clients.OthersInGroup(details.groupName).broadcastShipmentDetails(details.text, "AUTHENTICATED", details.connectionId);
                    break;
            }
        }

        public void successfullyScanned(string connectionId)
        {
            Clients.Client(connectionId).broadcastScanned();
        }
        public override Task OnConnected()
        {
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            /*
                 * Function that remove a client(user)
            */

            string[] groups;
            var clientInfo = scanningHubDic.FirstOrDefault(key => key.Key.Equals(Context.ConnectionId));

            //Remove the connection in the dictionary
            scanningHubDic.TryRemove(clientInfo.Key, out groups);

            //Remove the connection in the group
            for (int i = 0; i < groups.Length; i++)
                Groups.Remove(Context.ConnectionId, groups[i]);

            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            return base.OnReconnected();
        }

        public void removeClient(string connectionId)
        {
            /*
                 * Function that remove a client(user)
                 * connectionId  - connection Id of the client(user) 
            */

            string[] groups;
            var clientInfo = scanningHubDic.FirstOrDefault(key => key.Key.Equals(connectionId));

            //Remove the connection in the dictionary
            scanningHubDic.TryRemove(clientInfo.Key, out groups);

            //Remove the connection in the group
            for (int i = 0; i < groups.Length; i++)
                Groups.Remove(connectionId, groups[i]);
        }
    }
}