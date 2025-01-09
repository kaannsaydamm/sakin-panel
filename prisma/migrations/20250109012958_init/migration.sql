-- CreateTable
CREATE TABLE "PacketData" (
    "id" SERIAL NOT NULL,
    "srcIp" TEXT NOT NULL,
    "dstIp" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PacketData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SniData" (
    "id" SERIAL NOT NULL,
    "sni" TEXT NOT NULL,
    "srcIp" TEXT NOT NULL,
    "dstIp" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SniData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PacketData_srcIp_dstIp_idx" ON "PacketData"("srcIp", "dstIp");

-- CreateIndex
CREATE INDEX "SniData_sni_idx" ON "SniData"("sni");

-- CreateIndex
CREATE INDEX "SniData_srcIp_dstIp_idx" ON "SniData"("srcIp", "dstIp");
