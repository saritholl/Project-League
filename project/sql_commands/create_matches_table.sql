-- IF OBJECT_ID('dbo.Fixtures', 'U') IS NOT NULL
-- DROP TABLE dbo.Fixtures
-- GO
-- -- Create the table in the specified schema
-- CREATE TABLE dbo.Fixtures
-- (
--     id INT IDENTITY(1,1) NOT NULL PRIMARY KEY, -- primary key column
--     roundId INT NOT NULL,
--     homeTeamId INT NOT NULL,
--     awayTeamId INT NOT NULL,
--     stadiumId INT NOT NULL,
--     refereeId1 INT,
--     refereeId2 INT,
--     refereeId3 INT,
--     refereeId4 INT,
--     startTime VARCHAR(255) NOT NULL,
-- );
-- GO

SELECT *
FROM dbo.Fixtures
GO