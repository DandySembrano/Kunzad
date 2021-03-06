﻿CREATE TABLE [dbo].[Trucking]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [DocumentNo] VARCHAR(20) NOT NULL, 
	[TruckerId] INT NOT NULL, 
    [TruckId] INT NOT NULL, 
	[DriverId] INT NOT NULL,
    [OriginServiceableAreaId] INT NOT NULL, 
    [DestinationServiceableAreaId] INT NOT NULL, 
    [TruckerCost] MONEY NOT NULL DEFAULT 0, 
    [TruckingStatusId] BIT NOT NULL DEFAULT 0, 
    [TruckCallDate] DATETIME NULL, 
    [TruckCallTime] TIME NULL, 
    [DispatchDate] DATE NULL, 
    [DispatchTime] TIME NULL,
    [CompletedDate] DATE NULL, 
    [CompletedTime] TIME NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_Trucking_Truck] FOREIGN KEY ([TruckId]) REFERENCES [Truck]([Id]), 
    CONSTRAINT [FK_Trucking_Trucker] FOREIGN KEY ([TruckerId]) REFERENCES [Trucker]([Id]), 
    CONSTRAINT [FK_Trucking_Driver] FOREIGN KEY ([DriverId]) REFERENCES [Driver]([Id]), 
)