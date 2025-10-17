"use client"
import { CardImg, Placeholder, Card } from "reactstrap"

export default function ProductPHC() {
    return (
        <Card className="p-2">
            <CardImg
                alt="Card image cap"
                src="https://picsum.photos/id/135/318/180?grayscale&blur=10"
                top
                width="100%"
            />
            <Placeholder className="my-2" xs={7} />
            <Placeholder className="my-2" xs={6} />
            <Placeholder className="my-2" xs={6} />
        </Card>
    )
}
