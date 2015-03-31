CREATE TABLE [dbo].[ServiceCharge]
(
	[Id] INT NOT NULL PRIMARY KEY, 
	[ServiceId] int NOT NULL,
	[ChargeId] int NOT NULL,
    [ChargeName] VARCHAR(150) NOT NULL,
	[IsTaxInclusive] BIT NOT NULL DEFAULT 0,
	[TaxPercentage] DECIMAL(5, 2) NOT NULL DEFAULT 0, 
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_ServiceCharge_Service] FOREIGN KEY ([ServiceId]) REFERENCES [Service]([Id]), 
    CONSTRAINT [FK_ServiceCharge_Charge] FOREIGN KEY ([ChargeId]) REFERENCES [Charge]([Id]),
)
