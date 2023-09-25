create database robsonclassification;
use robsonclassification;


ALTER TABLE robsonsdata
ADD UNIQUE (patient_id);

ALTER TABLE robsonsdata
ADD COLUMN B2Gender VARCHAR(255);
ALTER TABLE robsonsdata
ADD COLUMN B2Weight VARCHAR(255);
ALTER TABLE robsonsdata
ADD COLUMN b2_date_of_birth DATE;
ALTER TABLE robsonsdata
ADD COLUMN b2_time_of_birth TIME;

ALTER TABLE robsonsdata
CHANGE COLUMN BabyDetails B1Gender VARCHAR(255);
ALTER TABLE robsonsdata
CHANGE COLUMN weight B1Weight VARCHAR(255);
ALTER TABLE robsonsdata
CHANGE COLUMN date_of_birth b1_date_of_birth DATE;
ALTER TABLE robsonsdata
CHANGE COLUMN time_of_birth b1_time_of_birth TIME;


CREATE TABLE robsonsdata (
  id INT AUTO_INCREMENT PRIMARY KEY,
  obs_index VARCHAR(255),
  weeks VARCHAR(255),
  pog VARCHAR(255),
  previous_cesarean VARCHAR(255),
  fetus_type VARCHAR(255),
  presentation_single VARCHAR(255),
  presentation_twin VARCHAR(255),
  Labour VARCHAR(255),
  ripening VARCHAR(255),
  induced_augmented VARCHAR(255),
  delivery VARCHAR(255),
  indication_ovd VARCHAR(255),
  indication_caesarean VARCHAR(255),
  Stage VARCHAR(255),
  BabyDetails VARCHAR(255),
  weight VARCHAR(255),
  apgar1 VARCHAR(255),
  apgar5 VARCHAR(255),
  outcome VARCHAR(255),
  indication VARCHAR(255),
  final_outcome VARCHAR(255),
  indication_for_induction VARCHAR(255),
  date_of_birth DATE,
  time_of_birth TIME,
  created_by enum('student','doctor'),
  created_on DATETIME,
  group_name VARCHAR(255),
  review VARCHAR(255)
);

CREATE TABLE `groups` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_name VARCHAR(255),
  created_by VARCHAR(255),
  created_on DATETIME,
  dataId INT,
  FOREIGN KEY (dataId) REFERENCES robsonsdata(id)
);

CREATE TABLE loginauth (
  user_name VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  role ENUM('doctor', 'student') NOT NULL
);

desc `groups`;
desc loginauth;
desc robsonsdata;

select * from `groups`;
select * from loginauth;
select * from robsonsdata;
SELECT COUNT(*) AS count FROM robsonsdata WHERE patient_id = 'JD';
-- Insert row for a doctor
INSERT INTO loginauth (user_name, password, role);
VALUES ('d', 'd', 'doctor');

-- Insert row for a student
INSERT INTO loginauth (user_name, password, role)
VALUES ('s', 's', 'student');


ALTER TABLE `groups`
DROP COLUMN dataId;
ALTER TABLE `groups`
ADD COLUMN patient_id VARCHAR(20);

ALTER TABLE `groups`
ADD CONSTRAINT groups_ibfk_1
FOREIGN KEY (patient_id)
REFERENCES robsonsdata(patient_id)
ON DELETE CASCADE;

ALTER TABLE `groups`
DROP FOREIGN KEY groups_ibfk_2;

ALTER TABLE `groups`
ADD COLUMN department VARCHAR(20);
ALTER TABLE robsonsdata
ADD COLUMN department VARCHAR(20);

ALTER TABLE loginauth
ADD COLUMN department VARCHAR(20);

ALTER TABLE robsonsdata
MODIFY created_by ENUM('doctor', 'student', 'department') NOT NULL;

ALTER TABLE loginauth
MODIFY role ENUM('doctor', 'student', 'department') NOT NULL;







