﻿CREATE TABLE [dbo].[AirFreight]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
    [AirLineId] INT NOT NULL, 
	[AirWaybillNumber] VARCHAR(20) NULL,
	[AirWaybillDate] DATETIME NULL,
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
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_AirFreight_AirLine] FOREIGN KEY ([AirLineId]) REFERENCES [AirLine]([Id]), 
    CONSTRAINT [FK_AirFreight_OriginBusinessUnit] FOREIGN KEY ([OriginBusinessUnitId]) REFERENCES [BusinessUnit]([Id]),
	CONSTRAINT [FK_AirFreight_DestinationBusinessUnit] FOREIGN KEY ([DestinationBusinessUnitId]) REFERENCES [BusinessUnit]([Id]),
)