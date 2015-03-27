CREATE TABLE [dbo].[VesselVoyage]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
    [VesselId] INT NOT NULL, 
	[VoyageNo] VARCHAR(20) NOT NULL,
	[EstimatedDepartureDate] DATETIME NOT NULL, 
    [EstimatedDepartureTime] TIME NOT NULL, 
    [EstimatedArrivalDate] DATETIME NOT NULL, 
    [EstimatedArrivalTime] TIME NOT NULL, 
    [OriginBusinessUnitId] INT NOT NULL, 
    [DestinationBusinessUnitId] INT NOT NULL, 
	[DepartureDate] DATETIME NULL, 
    [DepartureTime] TIME NULL, 
    [ArrivalDate] DATETIME NULL, 
    [ArrivalTime] TIME NULL, 
    [CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL
)