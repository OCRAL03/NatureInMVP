import Card from '../../components/ui/Card'
import RoleSidebar from '../../components/layout/RoleSidebar'

export default function ExpertDashboard() {
  return (
    <div className="flex gap-4">
      <RoleSidebar role="expert" />
      <div className="grid md:grid-cols-3 gap-4 flex-1">
        <Card className="p-4 md:col-span-3">
          <div className="font-semibold">Panel de experto</div>
          <div className="text-sm text-muted">Comparte y valida contenido científico.</div>
        </Card>
      </div>
    </div>
  )
}

