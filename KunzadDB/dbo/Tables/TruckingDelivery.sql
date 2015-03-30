CREATE TABLE [dbo].[TruckingDelivery]
(
	[Id] INT NOT NULL PRIMARY KEY, 
	[TruckingId] INT NOT NULL,
    [ShipmentId] INT NOT NULL, 
	[CustomerId] INT NOT NULL,
    [CustomerDocumentNo] VARCHAR(20) NULL,
	[Quantity] SMALLINT NOT NULL DEFAULT 0, 
    [CBM] DECIMAL(18, 6) NOT NULL DEFAULT 0, 
    [Description] TEXT NULL, 
	[DeliverTo] VARCHAR(150) NULL,
    [DeliveryAddressId] INT NULL,
    [DeliveryDate] DATETIME NULL,
	[DeliveryTime] TIME NULL,
	[CostAllocation] MONEY NOT NULL DEFAULT 0,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_TruckingDelivery_Trucking] FOREIGN KEY ([TruckingId]) REFERENCES [Trucking]([Id]), 
    CONSTRAINT [FK_TruckingDelivery_Shipment] FOREIGN KEY ([ShipmentId]) REFERENCES [Shipment]([Id]), 
    CONSTRAINT [FK_TruckingDelivery_Customer] FOREIGN KEY ([CustomerId]) REFERENCES [Customer]([Id]) 
)

GO

CREATE INDEX [IX_TruckingDelivery_TruckingId] ON [dbo].[TruckingDelivery] ([TruckingId])

GO

CREATE INDEX [IX_TruckingDelivery_CustomerDocumentNo] ON [dbo].[TruckingDelivery] ([CustomerDocumentNo])

GO

CREATE NONCLUSTERED INDEX [IX_TruckingDelivery_CustomerId_CustomerDocumentNo] ON [dbo].[TruckingDelivery] 
(
	[CustomerId] ASC,
	[CustomerDocumentNo] ASC
)