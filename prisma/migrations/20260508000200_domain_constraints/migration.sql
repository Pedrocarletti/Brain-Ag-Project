CREATE UNIQUE INDEX "crops_name_lower_key" ON "crops" (LOWER("name"));
CREATE UNIQUE INDEX "harvests_name_lower_key" ON "harvests" (LOWER("name"));

ALTER TABLE "farms"
  ADD CONSTRAINT "farms_total_area_positive_check" CHECK ("totalArea" > 0),
  ADD CONSTRAINT "farms_agricultural_area_non_negative_check" CHECK ("agriculturalArea" >= 0),
  ADD CONSTRAINT "farms_vegetation_area_non_negative_check" CHECK ("vegetationArea" >= 0),
  ADD CONSTRAINT "farms_area_sum_check" CHECK (("agriculturalArea" + "vegetationArea") <= "totalArea");
