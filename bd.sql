CREATE TABLE demande (
  id_demande text  NOT NULL,
  id_patient text NOT NULL,
  ville text NOT NULL,
  date_creation date NOT NULL,
  date_validation date DEFAULT NULL,
  date_debut date NOT NULL,
  date_fin date NOT NULL,
  description text NOT NULL,
  etat text NOT NULL,
  adresse_hospital text NOT NULL,
  adresse_patient text NOT NULL
) ;


CREATE TABLE ETS (
  id_ets text NOT NULL,
  nom text NOT NULL,
  phone text NOT NULL,
  adresse text NOT NULL,
  password text NOT NULL
) ;

CREATE TABLE ficheTransport (
  id_fiche text NOT NULL,
  id_proposition text NOT NULL,
  id_ets text NOT NULL,
  date_creation date NOT NULL
) ;


CREATE TABLE patient (
  id_patient text NOT NULL,
  last_name text   NOT NULL,
  first_name text NOT NULL,
  phone text NOT NULL,
  num_ass_soc text NOT NULL,
  date_naissance text NOT NULL,
  wilaya text NOT NULL,
  password text NOT NULL,
  adresse text NOT NULL
) ;

CREATE TABLE proposition (
  id_proposition text NOT NULL,
  id_demande text NOT NULL,
  etat text NOT NULL,
  date_creation date NOT NULL,
  id_ets text NOT NULL
) ;

CREATE TABLE reclamation (
  id_reclamation text NOT NULL,
  id_reclamateur text NOT NULL,
  titre text NOT NULL,
  contenu text NOT NULL,
  etat text NOT NULL,
  date_creation date NOT NULL
) ;

CREATE TABLE staff_cnas (
  id_staff_cnas text NOT NULL,
  nom text NOT NULL,
  prenom text   NOT NULL,
  code text   NOT NULL,
  password text NOT NULL
) ;





CREATE TABLE transport (
  id_transport int NOT NULL,
  id_ets int NOT NULL,
  id_proposition int NOT NULL
) ;

