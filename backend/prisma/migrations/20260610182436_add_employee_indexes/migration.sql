-- CreateIndex
CREATE INDEX "Employee_department_isDeleted_idx" ON "Employee"("department", "isDeleted");

-- CreateIndex
CREATE INDEX "Employee_country_isDeleted_idx" ON "Employee"("country", "isDeleted");
