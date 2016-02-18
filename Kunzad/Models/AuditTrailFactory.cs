using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Reflection;
using System.Data.Common;
using System.Data.Entity.Infrastructure;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.ComponentModel.DataAnnotations.Schema;
using Kunzad.Models;
 
namespace fastlogisticsApi.Models
{
    public class AuditTrailFactory
    {
        private DbContext context;
 
        public AuditTrailFactory(DbContext context)
        {
            this.context = context;
        }
        public AuditTrail GetAudit(DbEntityEntry entry)
        {
            AuditTrail audit = new AuditTrail();
            audit.UserId = 1; //System.Web.HttpContext.Current.User.Identity.Name; //Change this line according to your needs
            audit.TableName = GetTableName(entry);
            audit.LogDate = DateTime.Now;
            audit.TableId = (int)GetKeyValue(entry);
 
            //entry is Added 
            if (entry.State == EntityState.Added)
            {
                //var newValues = new StringBuilder();
                //SetAddedProperties(entry, newValues);
                //audit.NewData = newValues.ToString();
                audit.Actions = AuditActions.I.ToString();
            }
            //entry in deleted
            else if (entry.State == EntityState.Deleted)
            {
                var oldValues = new StringBuilder();
                SetDeletedProperties(entry, oldValues);
                audit.OldData = oldValues.ToString();
                audit.Actions = AuditActions.D.ToString();
            }
            //entry is modified
            else if (entry.State == EntityState.Modified)
            {
                var oldValues = new StringBuilder();
                var newValues = new StringBuilder();
                SetModifiedProperties(entry, oldValues, newValues);
                audit.OldData = oldValues.ToString();
                audit.NewData = newValues.ToString();
                audit.Actions = AuditActions.U.ToString();
            }
 
            return audit;
        }
 
        public void SetAddedProperties(DbEntityEntry entry, StringBuilder newData)
        {
            foreach (var propertyName in entry.CurrentValues.PropertyNames)
            {
                var newVal = entry.CurrentValues[propertyName];
                if (newVal != null)
                {
                    newData.AppendFormat("{0}={1} || ", propertyName, newVal);
                }
            }
            if (newData.Length > 0)
                newData = newData.Remove(newData.Length-3, 3);
        }
 
        private void SetDeletedProperties(DbEntityEntry entry, StringBuilder oldData)
        {
            DbPropertyValues dbValues = entry.GetDatabaseValues();
            foreach (var propertyName in dbValues.PropertyNames)
            {
                var oldVal = dbValues[propertyName];
                if (oldVal != null)
                {
                    oldData.AppendFormat("{0}={1} || ", propertyName, oldVal);
                }
            }
            if (oldData.Length > 0)
                oldData = oldData.Remove(oldData.Length - 3, 3);
        }
 
        private void SetModifiedProperties(DbEntityEntry entry, StringBuilder oldData, StringBuilder newData)
        {
            DbPropertyValues dbValues = entry.GetDatabaseValues();
            foreach (var propertyName in entry.OriginalValues.PropertyNames)
            {
                var oldVal = dbValues[propertyName];
                var newVal = entry.CurrentValues[propertyName];
                if (oldVal != null && newVal != null && !Equals(oldVal, newVal))
                {
                    newData.AppendFormat("{0}={1} || ", propertyName, newVal);
                    oldData.AppendFormat("{0}={1} || ", propertyName, oldVal);
                }
            }
            if (oldData.Length > 0)
                oldData = oldData.Remove(oldData.Length - 3, 3);
            if (newData.Length > 0)
                newData = newData.Remove(newData.Length - 3, 3);
        }
 
        public long? GetKeyValue(DbEntityEntry entry)
        {
            var objectStateEntry = ((IObjectContextAdapter)context).ObjectContext.ObjectStateManager.GetObjectStateEntry(entry.Entity);
            long id=0;
            if (objectStateEntry.EntityKey.EntityKeyValues != null)
                id = Convert.ToInt64(objectStateEntry.EntityKey.EntityKeyValues[0].Value);
 
            return id;
        }
 
        private string GetTableName(DbEntityEntry dbEntry)
        {
            TableAttribute tableAttr = dbEntry.Entity.GetType().GetCustomAttributes(typeof(TableAttribute), false).SingleOrDefault() as TableAttribute;
            string tableName = tableAttr != null ? tableAttr.Name : dbEntry.Entity.GetType().Name;
            return tableName;
        }
    }
 
    public enum AuditActions
    {
        I,
        U,
        D
    }
}
