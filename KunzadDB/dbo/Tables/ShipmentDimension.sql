CREATE TABLE [dbo].[ShipmentDimension]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [ShipmentId] INT NOT NULL, 
    [Length] DECIMAL(18, 4) NOT NULL DEFAULT 0, 
    [Width] DECIMAL(18, 4) NOT NULL DEFAULT 0, 
    [Heigth] DECIMAL(18, 4) NOT NULL DEFAULT 0, 
    [Quantity] SMALLINT NOT NULL DEFAULT 0, 
    [TotalCBM] DECIMAL(18, 6) NOT NULL DEFAULT 0, 
    [Description] TEXT NULL, 
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL,
    CONSTRAINT [FK_ShipmentDimension_Shipment] FOREIGN KEY ([ShipmentId]) REFERENCES [Shipment]([Id])
)

GO

CREATE INDEX [IX_ShipmentDimension_ShipmentId] ON [dbo].[ShipmentDimension] ([ShipmentID])
