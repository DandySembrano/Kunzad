CREATE TABLE [dbo].[Customer]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Code] VARCHAR(20) NULL, 
    [Name] VARCHAR(150) NOT NULL, 
	[CustomerGroupId] INT NOT NULL,
    [TIN] VARCHAR(50) NULL, 
    [IndustryId] INT NOT NULL, 
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_Customer_CustomerGroup] FOREIGN KEY ([CustomerGroupId]) REFERENCES [CustomerGroup]([Id]), 
    CONSTRAINT [FK_Customer_Industry] FOREIGN KEY ([IndustryId]) REFERENCES [Industry]([Id])
)