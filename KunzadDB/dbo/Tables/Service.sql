CREATE TABLE [dbo].[Service]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] VARCHAR(100) NOT NULL,
	[ServiceCategoryId] int NOT NULL,
	[Description] VARCHAR(255),
	[IsMultimodal] BIT NOT NULL DEFAULT 0,
	[Length] DECIMAL(18, 4) NOT NULL DEFAULT 0, 
    [Width] DECIMAL(18, 4) NOT NULL DEFAULT 0, 
    [Height] DECIMAL(18, 4) NOT NULL DEFAULT 0, 
	[MaxWeight] DECIMAL(18, 4) NOT NULL DEFAULT 0,
	[DeliveryWorkingDays] int NULL ,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_Service_ServiceCategory] FOREIGN KEY ([ServiceCategoryId]) REFERENCES [ServiceCategory]([Id]) 
)