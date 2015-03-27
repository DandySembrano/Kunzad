CREATE TABLE [dbo].[Shipment]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [BusinessUnitId] INT NOT NULL, 
    [TransportServiceId] INT NOT NULL, 
    [CustomerId] INT NOT NULL, 
    [Quantity] SMALLINT NOT NULL DEFAULT 0, 
    [TotalCBM] DECIMAL(18, 4) NOT NULL DEFAULT 0, 
    [Description] TEXT NOT NULL, 
    [DeliveryAddressId] INT NOT NULL,
	[IsRevenue] MONEY NOT NULL DEFAULT 0,
	[Revenue] MONEY NOT NULL DEFAULT 0,
	[Tax] MONEY NOT NULL DEFAULT 0,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL 
)