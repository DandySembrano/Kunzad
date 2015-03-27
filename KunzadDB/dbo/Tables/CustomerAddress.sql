CREATE TABLE [dbo].[CustomerAddress]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [CustomerId] INT NOT NULL, 
    [AddressId] INT NOT NULL, 
    [IsBillingAddress] BIT NOT NULL DEFAULT 0, 
    [IsDeliveryAddress] BIT NOT NULL DEFAULT 0, 
    [IsPickupAddress] BIT NOT NULL DEFAULT 0, 
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_CustomerAddress_Customer] FOREIGN KEY ([CustomerId]) REFERENCES [Customer]([Id]), 
    CONSTRAINT [FK_CustomerAddress_Address] FOREIGN KEY ([AddressId]) REFERENCES [Address]([Id])
)