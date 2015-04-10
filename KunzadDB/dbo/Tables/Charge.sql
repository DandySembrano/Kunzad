CREATE TABLE [dbo].[Charge]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [Name] VARCHAR(150) NOT NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 	 
)
