CREATE TABLE [dbo].[CourierTransactionDetails]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [CourierTransactionId] INT NOT NULL, 
    [ShipmentId] INT NOT NULL, 
    [CostAllocation] MONEY NOT NULL DEFAULT 0,
    [CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_CourierTransactionDetails_CourierTransaction] FOREIGN KEY ([CourierTransactionId]) REFERENCES [CourierTransaction]([Id]), 
    CONSTRAINT [FK_CourierTransactionDetails_Shipment] FOREIGN KEY ([ShipmentId]) REFERENCES [Shipment]([Id]) 
)
