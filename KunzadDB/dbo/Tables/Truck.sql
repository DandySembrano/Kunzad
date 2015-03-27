CREATE TABLE [dbo].[Truck]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [PlateNo] VARCHAR(50) NOT NULL,
	[TruckTypeId] INT NOT NULL,
	[WeightCapacity] DECIMAL(18, 4) NULL, 
    [VolumeCapacity] DECIMAL(18, 4) NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 

)