USE ECoVFactoryDB;
GO

-- Check if Verified column exists and has data
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'Verified')
BEGIN
    -- Copy data from Verified to IsVerified if needed
    UPDATE Factories SET IsVerified = Verified WHERE IsVerified IS NULL AND Verified IS NOT NULL;
    
    -- Drop the old Verified column
    ALTER TABLE Factories DROP COLUMN Verified;
    
    PRINT '✅ Removed duplicate Verified column';
END
ELSE
BEGIN
    PRINT '✅ Verified column already removed';
END
