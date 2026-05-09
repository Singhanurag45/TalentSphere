import { motion } from "framer-motion";

type KpiCardProps = {
  title: string;
  value: string;
  change: string;
  toneClassName: string;
  delay?: number;
};

export function KpiCard({ title, value, change, toneClassName, delay = 0 }: KpiCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl border p-5 shadow-soft ${toneClassName}`}
    >
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{change}</p>
    </motion.article>
  );
}
