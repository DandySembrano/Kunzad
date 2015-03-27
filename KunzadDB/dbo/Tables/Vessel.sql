CREATE TABLE [dbo].[Vessel]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] VARCHAR(150) NOT NULL, 
    [ShippingLineId] INT NOT NULL, 
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_Vessel_ShippingLine] FOREIGN KEY ([ShippingLineId]) REFERENCES [ShippingLine]([Id])
)