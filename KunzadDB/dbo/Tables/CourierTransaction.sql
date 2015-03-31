CREATE TABLE [dbo].[CourierTransaction]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [CourierId] INT NOT NULL,
    [BusinessUnitId] INT NOT NULL, 
    [CourierCost] MONEY NOT NULL DEFAULT 0, 
    [CallDate] DATETIME NULL, 
    [CallTime] TIME NULL, 
    [CompletedDate] DATE NULL, 
    [CompletedTime] TIME NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_CourierService_Courier] FOREIGN KEY ([CourierId]) REFERENCES [Courier]([Id]), 
    CONSTRAINT [FK_CourierService_BusinessUnit] FOREIGN KEY ([BusinessUnitId]) REFERENCES [BusinessUnit]([Id])
)
