import { Button } from '@/components/ui/button'

export const CallNowButton = () => {
  return (
    <Button size="lg" asChild className="ring-2 ring-white shadow-md shadow-white">
      <a href="tel:7138205982">Call Now!</a>
    </Button>
  )
}