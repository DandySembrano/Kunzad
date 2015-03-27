CREATE TABLE [dbo].[SeaFreightShipment]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
	[SeaFreightId] INT NOT NULL,
    [ShipmentId] INT NOT NULL, 
	[CostAllocation] MONEY NOT NULL DEFAULT 0,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_SeaFreightShipment_SeaFreight] FOREIGN KEY ([SeaFreightId]) REFERENCES [SeaFreight]([Id]), 
    CONSTRAINT [FK_SeaFreightShipment_Shipment] FOREIGN KEY ([ShipmentId]) REFERENCES [Shipment]([Id])
)