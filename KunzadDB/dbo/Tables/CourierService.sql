CREATE TABLE [dbo].[CourierService]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [CourierId] INT NOT NULL,
    [ServiceableAreaId] INT NOT NULL, 
    [CourierCost] MONEY NOT NULL DEFAULT 0, 
    [CallDate] DATETIME NULL, 
    [CallTime] TIME NULL, 
    [CompletedDate] DATE NULL, 
    [CompletedTime] TIME NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL
)
