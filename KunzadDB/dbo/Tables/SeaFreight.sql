CREATE TABLE [dbo].[SeaFreight]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[BLNumber] VARCHAR(20) NOT NULL,
	[BLDate] DATETIME NOT NULL,
	[VesselVoyageId] INT NOT NULL,
    [OriginBusinessUnitId] INT NOT NULL, 
    [DestinationBusinessUnitId] INT NOT NULL, 
	[FreightCost] MONEY NOT NULL DEFAULT 0,
    [CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_SeaFreight_OriginBusinessUnit] FOREIGN KEY ([OriginBusinessUnitId]) REFERENCES [BusinessUnit]([Id]),
	CONSTRAINT [FK_SeaFreight_DestinationBusinessUnit] FOREIGN KEY ([DestinationBusinessUnitId]) REFERENCES [BusinessUnit]([Id]), 
    CONSTRAINT [FK_SeaFreight_VesselVoyage] FOREIGN KEY ([VesselVoyageId]) REFERENCES [VesselVoyage]([Id]),
)