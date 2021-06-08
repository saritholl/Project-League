IF OBJECT_ID('dbo.Rounds', 'U') IS NOT NULL
DROP TABLE dbo.Rounds
GO
-- Create the table in the specified schema
CREATE TABLE dbo.Rounds
(
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY, -- primary key column
    RoundName VARCHAR(255),
);
GO

SELECT *
FROM dbo.Rounds
GO