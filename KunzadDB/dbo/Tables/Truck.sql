CREATE TABLE [dbo].[Truck]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [PlateNo] VARCHAR(50) NOT NULL,
	[TruckTypeId] INT NOT NULL,
	[TruckerId] INT NOT NULL,
	[WeightCapacity] DECIMAL(18, 4) NULL, 
    [VolumeCapacity] DECIMAL(18, 4) NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_Truck_TruckType] FOREIGN KEY ([TruckTypeId]) REFERENCES [TruckType]([Id]), 
	CONSTRAINT [FK_Truck_Trucker] FOREIGN KEY ([TruckerId]) REFERENCES [Trucker]([Id]), 
)