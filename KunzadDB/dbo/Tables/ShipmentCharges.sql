CREATE TABLE [dbo].[ShipmentCharges]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [ShipmentId] INT NOT NULL, 
    [ServiceChargeId] INT NOT NULL, 
    [ServiceChargeName] VARCHAR(150) NOT NULL, 
    [Amount] MONEY NOT NULL DEFAULT 0, 
	[IsTaxInclusive] BIT NOT NULL DEFAULT 0,
	[TaxAmount] MONEY NOT NULL DEFAULT 0,
	[TaxPercentage] DECIMAL(5, 2) NOT NULL DEFAULT 0,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_ShipmentCharges_Shipment] FOREIGN KEY ([ShipmentId]) REFERENCES [Shipment]([Id]), 
    CONSTRAINT [FK_ShipmentCharges_ServiceCharge] FOREIGN KEY ([ServiceChargeId]) REFERENCES [ServiceCharge]([Id]),
)
