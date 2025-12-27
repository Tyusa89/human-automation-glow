-- Delete the duplicate services (newer entries created on 2025-12-27)
DELETE FROM appointment_services 
WHERE id IN (
  '81efea1d-139f-4d68-8e1c-f5da24c97ebc',
  '6ba0b517-0cb1-4f3a-81e2-9e14aa087e02',
  'd48f49c9-54f8-4583-90f0-2b0b8e478a27'
)