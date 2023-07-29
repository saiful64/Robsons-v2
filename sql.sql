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

-- Insert row for a doctor
INSERT INTO loginauth (user_name, password, role)
VALUES ('d', 'd', 'doctor');

-- Insert row for a student
INSERT INTO loginauth (user_name, password, role)
VALUES ('s', 's', 'student');














