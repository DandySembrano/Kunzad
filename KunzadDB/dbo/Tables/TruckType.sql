CREATE TABLE [dbo].[TruckType]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [Type] VARCHAR(50) NULL, 
    [WeightCapacity] DECIMAL(18, 4) NULL, 
    [VolumeCapacity] DECIMAL(18, 4) NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
)