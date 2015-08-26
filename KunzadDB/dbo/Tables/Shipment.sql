﻿CREATE TABLE [dbo].[Shipment]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [BusinessUnitId] INT NOT NULL, 
    [ServiceId] INT NOT NULL, 
	[ShipmentTypeId] INT NOT NULL,
	[PaymentMode] CHAR(1) NOT NULL,
    [CustomerId] INT NOT NULL, 
	[BillToCustomerId] INT NULL, 
    [Quantity] SMALLINT NOT NULL DEFAULT 0, 
    [TotalCBM] DECIMAL(18, 6) NOT NULL DEFAULT 0, 
    [IsRevenue] BIT NOT NULL DEFAULT 0,
	[Revenue] MONEY NOT NULL DEFAULT 0,
	[IsTaxInclusive] BIT NOT NULL DEFAULT 0,
	[TaxAmount] MONEY NOT NULL DEFAULT 0,
	[TaxPercentage] DECIMAL(5, 2) NOT NULL DEFAULT 0,
	[Description] TEXT NOT NULL, 
	[DeliverTo] VARCHAR(150) NOT NULL,
    [DeliveryAddressId] INT NOT NULL,
	[DeliveryDate] DATETIME NULL,
	[DeliveryTime] TIME NULL,
	[ReceivedByName] VARCHAR(150) NULL,	
    [TargetPickupDate] DATE NULL, 
    [TargetPickupTime] TIME NULL, 
    [DeliverToContactNo] TEXT NULL, 
    [OriginAddressId] INT NULL, 
	[ParentShipmentId] INT NOT NULL DEFAULT 0,
	[IsConsolidation] BIT NOT NULL DEFAULT 0,
	[IsMultipleDelivery] BIT NOT NULL DEFAULT 0,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_Shipment_BusinessUnit] FOREIGN KEY ([BusinessUnitId]) REFERENCES [BusinessUnit]([Id]), 
	CONSTRAINT [FK_Shipment_Service] FOREIGN KEY ([ServiceId]) REFERENCES [Service]([Id]),
    CONSTRAINT [FK_Shipment_ShipmentType] FOREIGN KEY ([ShipmentTypeId]) REFERENCES [ShipmentType]([Id]), 
    CONSTRAINT [FK_Shipment_Customer] FOREIGN KEY ([CustomerId]) REFERENCES [Customer]([Id]) 
)