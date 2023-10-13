create database robsonclassification;
use robsonclassification;

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
  B1Gender VARCHAR(255),
  B1Weight VARCHAR(255),
  b1_date_of_birth DATE,
  b1_time_of_birth TIME,
  B2Gender VARCHAR(255),
  B2Weight VARCHAR(255),
  b2_date_of_birth DATE,
  b2_time_of_birth TIME,
  apgar1 VARCHAR(255),
  apgar5 VARCHAR(255),
  outcome VARCHAR(255),
  indication VARCHAR(255),
  final_outcome VARCHAR(255),
  indication_for_induction VARCHAR(255),
  created_by enum('student','doctor','department'),
  created_on DATETIME,
  group_name VARCHAR(255),
  review VARCHAR(255),
  department VARCHAR(20),
  patient_id VARCHAR(20) UNIQUE
);

CREATE TABLE `groups` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_name VARCHAR(50),
  created_by VARCHAR(50),
  created_on DATETIME,
  patient_id VARCHAR(50),
  FOREIGN KEY (patient_id) REFERENCES robsonsdata(patient_id)
);

CREATE TABLE loginauth (
  user_name VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  role ENUM('doctor', 'student', 'department') NOT NULL
);

desc `groups`;
desc loginauth;
desc robsonsdata;

select * from `groups`;
select * from loginauth;
select * from robsonsdata;

SELECT COUNT(*) AS count FROM robsonsdata WHERE patient_id = 'JD';

ALTER TABLE `groups`
ADD CONSTRAINT groups_ibfk_1
FOREIGN KEY (patient_id)
REFERENCES robsonsdata(patient_id)
ON DELETE CASCADE;

ALTER TABLE `groups`
DROP FOREIGN KEY groups_ibfk_2;

CREATE USER 'root'@'10.58.14.48' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON robsonclassification.* TO 'root'@'10.58.14.48';




















create database robsonclassification;
use robsonclassification;

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
  B1Gender VARCHAR(255),
  B1Weight VARCHAR(255),
  b1_date_of_birth DATE,
  b1_time_of_birth TIME,
  B2Gender VARCHAR(255),
  B2Weight VARCHAR(255),
  b2_date_of_birth DATE,
  b2_time_of_birth TIME,
  apgar1 VARCHAR(255),
  apgar5 VARCHAR(255),
  outcome VARCHAR(255),
  indication VARCHAR(255),
  final_outcome VARCHAR(255),
  indication_for_induction VARCHAR(255),
  created_by enum('student','doctor','department'),
  created_on DATETIME,
  group_name VARCHAR(255),
  review VARCHAR(255),
  department VARCHAR(20),
  patient_id VARCHAR(20) UNIQUE
);

CREATE TABLE `groups` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_name VARCHAR(50),
  created_by VARCHAR(50),
  created_on DATETIME,
  patient_id VARCHAR(50),
  FOREIGN KEY (patient_id) REFERENCES robsonsdata(patient_id)
);

CREATE TABLE loginauth (
  user_name VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  role ENUM('doctor', 'student', 'department') NOT NULL
);

desc `groups`;
desc loginauth;
desc robsonsdata;

select * from `groups`;
select * from loginauth;
select * from robsonsdata;

SELECT COUNT(*) AS count FROM robsonsdata WHERE patient_id = 'JD';

ALTER TABLE `groups`
ADD CONSTRAINT groups_ibfk_1
FOREIGN KEY (patient_id)
REFERENCES robsonsdata(patient_id)
ON DELETE CASCADE;

ALTER TABLE `groups`
DROP FOREIGN KEY groups_ibfk_2;

CREATE USER 'root'@'10.58.14.48' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON robsonclassification.* TO 'root'@'10.58.14.48';








