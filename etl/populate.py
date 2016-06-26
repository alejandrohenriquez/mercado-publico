#!/usr/local/bin/python

from datetime import date, timedelta

import argparse
import json
import requests
import os

# TODO: Mover a variable de ambiente
MERCADOPUBLICO_TOCKEN={{ MI TOKEN }}

def main():
    
    parser = options()
    args   = parser.parse_args()
    
    if args.date is None:
        parser.print_help()
        return

    source_url = 'http://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?fecha={0}&ticket={1}'

    destination_url = 'http://0.0.0.0:8080/api/tenders'
    check_url = 'http://0.0.0.0:8080/api/tenders/{0}/exists'

    stats = {
        'lines': 0,
        'save': 0,
        'exist': 0,
        'except': 0
    }

    try:
        date    = args.date.strftime('%d%m%Y')
        print date
        source  = requests.get(source_url.format(date, MERCADOPUBLICO_TOCKEN)).json()

        for tender in source['Listado']:
            stats['lines'] += 1
            try:
                exists = requests.get(check_url.format(tender['CodigoExterno'])).json()
                if exists['exists']:
                    stats['exist'] += 1
                    continue

                data = {
                    "code": tender['CodigoExterno'],
                    "name": tender['Nombre'],
                    "state": tender['CodigoEstado'],
                    "deadline": tender['FechaCierre'],
                }

                save = requests.post(destination_url, data=data).json()
                stats['save'] += 1


            except:
                stats['except'] += 1
                print tender
    finally:
        # TODO: guardas stats en la applicacion, en caso de error enviar un mail
        print stats

def options():
    parser = argparse.ArgumentParser(description='Importador de datos.')
    parser.add_argument('--today', '-t', dest='date',
        action='store_const', const=date.today(), help='Usa la fecha de hoy')
    parser.add_argument('--yesterday', '-y', dest='date',
        action='store_const', const=date.today() - timedelta(days=1), help='Usa la fecha de ayer')
    parser.add_argument('--date', dest='date',
        help='Recibe la fecha por parametro (con formato YYYY-MM-DD)')

    return parser

def valid_date(s):
    try:
        return datetime.strptime(s, "%Y-%m-%d")
    except ValueError:
        msg = "Not a valid date: '{0}'.".format(s)
        raise argparse.ArgumentTypeError(msg)

if __name__ == "__main__":
    main()