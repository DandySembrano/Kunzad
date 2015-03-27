CREATE TABLE [dbo].[AirFreightShipment]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [AirFreightId] INT NOT NULL, 
    [ShipmentId] INT NOT NULL, 
	[CostAllocation] MONEY NOT NULL DEFAULT 0,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL 
    CONSTRAINT [FK_AirFreightShipment_AirFreight] FOREIGN KEY ([AirFreightId]) REFERENCES [AirFreight]([Id]),
	CONSTRAINT [FK_AirFreightShipment_Shipment] FOREIGN KEY ([ShipmentId]) REFERENCES [Shipment]([Id])
)