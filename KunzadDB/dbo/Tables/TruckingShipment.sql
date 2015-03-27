CREATE TABLE [dbo].[TruckingShipment]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [TruckingId] INT NOT NULL, 
    [ShipmentId] INT NOT NULL,
	[CostAllocation] MONEY NOT NULL DEFAULT 0,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_TruckingShipment_Trucking] FOREIGN KEY ([TruckingId]) REFERENCES [Trucking]([Id]), 
    CONSTRAINT [FK_TruckingShipment_Shipment] FOREIGN KEY ([ShipmentId]) REFERENCES [Shipment]([Id]) 
)